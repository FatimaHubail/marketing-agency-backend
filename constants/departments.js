const DEPARTMENTS = {
    digital: {
        name: "Digital Marketing",
        categories: ["digital"],
        inHouseTypes: ["social_media", "sem"],
        outsourceTypes: ["display", "influencer"],
    },
    content_brand: {
        name: "Content & Brand",
        categories: ["content_brand"],
        inHouseTypes: ["content_marketing", "brand_awareness"],
        // email_marketing -> outsourced
        outsourceTypes: ["email_marketing"],
    },
    offline: {
        name: "Offline & Traditional",
        categories: ["offline"],
        inHouseTypes: ["print", "event"],
        // ooh, broadcast, direct_mail, instore_activation -> outsourced
        outsourceTypes: ["ooh", "broadcast", "direct_mail", "instore_activation"],
    },
    specialized: {
        name: "Specialized Services",
        categories: ["specialized"],
        inHouseTypes: ["seo", "pr"],
        // product_launch -> outsourced
        outsourceTypes: ["product_launch"],
    },
};
const DEPARTMENT_KEYS = Object.keys(DEPARTMENTS);
const OUTSOURCED_CAMPAIGN_TYPES = [
    "display",
    "influencer",
    "email_marketing",
    "ooh",
    "broadcast",
    "direct_mail",
    "instore_activation",
    "product_launch",
];