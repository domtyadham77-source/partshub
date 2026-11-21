import worker, { type Env } from "../../worker/src/index";
export const onRequest: PagesFunction<Env> = ({ request, env }) => worker.fetch(request, env);
