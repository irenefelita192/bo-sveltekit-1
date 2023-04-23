import 'dotenv/config'

export async function post() {
    const assetPath = process.env.ASSET_PATH,
        baseEndpoint = process.env.BASE_API,
        googleClientID = process.env.GOOGLE_CLIENT_ID,
        boV1Domain = process.env.BO_V1_DOMAIN,
        boV2MenuID = process.env.BO_V2_MENU_ID

    return {
        body: {
            assetPath,
            baseEndpoint,
            googleClientID,
            boV1Domain,
            boV2MenuID,
        },
    }
}
