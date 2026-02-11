import app, { setupApp } from "../server/index";

export default async function handler(req: any, res: any) {
    await setupApp();
    app(req, res);
}
