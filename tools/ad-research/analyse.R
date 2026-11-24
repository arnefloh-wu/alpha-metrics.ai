# Usage: Rscript analyse.R daily.csv output_directory
# Base R only. Input is normalized ad-day aggregate data, not user-level data.
args <- commandArgs(trailingOnly = TRUE)
if (length(args) != 2L) stop("Usage: Rscript analyse.R daily.csv output_directory")
d <- read.csv(args[1], stringsAsFactors = FALSE)
required <- c("day", "treatment", "impressions", "clicks", "spend_eur")
stopifnot(all(required %in% names(d)), nrow(d) > 0L)
d <- d[required]
stopifnot(!anyNA(d), all(d$treatment %in% c("A","B")),
          !anyDuplicated(d[c("day","treatment")]),
          all(is.finite(d$impressions)), all(is.finite(d$clicks)),
          all(is.finite(d$spend_eur)), all(d$impressions >= 0),
          all(d$clicks >= 0), all(d$clicks <= d$impressions),
          all(d$impressions == floor(d$impressions)),
          all(d$clicks == floor(d$clicks)), all(d$spend_eur >= 0))
out <- args[2]
dir.create(out, recursive = TRUE, showWarnings = FALSE)
s <- aggregate(cbind(impressions, clicks, spend_eur) ~ treatment, d, sum)
stopifnot(identical(as.character(s$treatment), c("A","B")), all(s$impressions > 0))
s$ctr <- s$clicks / s$impressions
s$cpc_eur <- ifelse(s$clicks > 0, s$spend_eur / s$clicks, NA_real_)
s$cpm_eur <- 1000 * s$spend_eur / s$impressions
# Wilson intervals are nominal under independent Bernoulli impressions.
z <- qnorm(.975)
n <- s$impressions
p <- s$ctr
centre <- (p + z^2/(2*n))/(1+z^2/n)
half <- z*sqrt(p*(1-p)/n+z^2/(4*n^2))/(1+z^2/n)
s$ctr_low <- centre-half
s$ctr_high <- centre+half
write.csv(s, file.path(out,"summary.csv"), row.names=FALSE)
d$ctr <- ifelse(d$impressions > 0, d$clicks/d$impressions, NA_real_)
write.csv(d, file.path(out,"daily.csv"), row.names=FALSE)
a <- d[d$impressions > 0,]
a$treatment <- factor(a$treatment, levels=c("A","B"))
a$non_clicks <- a$impressions-a$clicks
report <- capture.output({
  cat("Descriptive ad performance (B versus A)\n")
  print(s)
  cat("CTR difference (percentage points):",100*diff(s$ctr),"\n")
  cat("Relative uplift:",if(s$ctr[1]>0) s$ctr[2]/s$ctr[1]-1 else NA_real_,"\n")
  cat("Days by treatment:\n"); print(table(d$day,d$treatment))
  cat("\nNominal inference only; no verified random assignment or user clustering.\n")
  if (all(s$clicks > 0 & s$clicks < s$impressions)) {
    m <- glm(cbind(clicks,non_clicks) ~ treatment, family=binomial(),data=a)
    print(summary(m))
    print(exp(cbind(OR=coef(m),confint.default(m))))
    if (length(unique(a$day)) > 1 && all(table(a$day,a$treatment)>0)) {
      md <- glm(cbind(clicks,non_clicks) ~ treatment+factor(day),family=binomial(),data=a)
      cat("\nDay-adjusted sensitivity model:\n")
      print(summary(md))
    }
  } else cat("Inferential model skipped: boundary outcome.\n")
  cat("\nClick counts need not represent unique people. Repeated exposure, delivery selection and overdispersion may invalidate nominal intervals and tests.\n")
})
writeLines(report,file.path(out,"report.txt"))
png(file.path(out,"ctr.png"),width=1000,height=650,res=120)
bp <- barplot(100*s$ctr,names.arg=s$treatment,ylim=c(0,max(100*s$ctr_high)*1.15),ylab="CTR (%)",main="Observed CTR (nominal 95% Wilson intervals)")
arrows(bp,100*s$ctr_low,bp,100*s$ctr_high,angle=90,code=3,length=.08)
dev.off()
