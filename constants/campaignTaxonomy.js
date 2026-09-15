const GOALS_BY_TYPE = {
    social_media: ["brand_awareness", "engagement", "follower_growth", "lead_generation"],
    sem: ["website_traffic", "lead_generation", "conversions"],
    display: ["brand_awareness", "retargeting", "reach"],
    influencer: ["brand_awareness", "engagement", "launch_buzz"],

    content_marketing: ["seo_traffic", "thought_leadership", "lead_nurturing"],
    email_marketing: ["retention", "reactivation", "promotions"],
    brand_awareness: ["reach", "impressions", "brand_recall"],

    print: ["local_reach", "product_awareness", "event_promotion"],
    ooh: ["local_reach", "brand_visibility"],
    event: ["lead_generation", "brand_experience", "launch_buzz"],
    broadcast: ["mass_reach", "brand_awareness"],
    direct_mail: ["local_reach", "retention", "reactivation"],
    instore_activation: ["product_trial", "conversion"],

    product_launch: ["launch_buzz", "pre_orders", "awareness"],
    seo: ["organic_traffic", "site_conversions"],
    pr: ["media_coverage", "reputation", "crisis_response"],
};

const ALL_GOALS = [...new Set(Object.values(GOALS_BY_TYPE).flat())];

const CAMPAIGN_TYPES = Object.keys(GOALS_BY_TYPE);

// Types that no in-house staff specializes in - these must always be
// handled by an outsource partner rather than assigned to staff.
const OUTSOURCE_ONLY_TYPES = [
    "display",
    "influencer",
    "email_marketing",
    "ooh",
    "broadcast",
    "direct_mail",
    "instore_activation",
    "product_launch",
];

module.exports = {
    GOALS_BY_TYPE,
    ALL_GOALS,
    CAMPAIGN_TYPES,
    OUTSOURCE_ONLY_TYPES,
};