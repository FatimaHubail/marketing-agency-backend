const DEPARTMENTS = {
    digital: {
        name: "Digital Marketing",
        categories: ["digital"],
        inHouseTypes: ["social_media", "sem"],

    },
    content_brand: {
        name: "Content & Brand",
        categories: ["content_brand"],
        inHouseTypes: ["content_marketing", "brand_awareness"],
        // email_marketing -> outsourced
    },
    offline: {
        name: "Offline & Traditional",
        categories: ["offline"],
        inHouseTypes: ["print", "event"],
        // ooh, broadcast, direct_mail, instore_activation -> outsourced
    },
    specialized: {
        name: "Specialized Services",
        categories: ["specialized"],
        inHouseTypes: ["seo", "pr"],
        // product_launch -> outsourced
    },
};

const DEPARTMENT_KEYS = Object.keys(DEPARTMENTS);

function getDepartment(key) {
    return DEPARTMENTS[key];
}

function isInHouse(departmentKey, campaignType) {
    const dept = DEPARTMENTS[departmentKey];
    return !!dept && dept.inHouseTypes.includes(campaignType);
}

module.exports = { DEPARTMENTS, DEPARTMENT_KEYS, getDepartment, isInHouse };