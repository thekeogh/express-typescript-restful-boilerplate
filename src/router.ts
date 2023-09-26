import { Router } from "express";

/**
 * Return a singleton instance of express router.
 *
 * @remarks
 * This exports a singleton instance of the Express router. It's initialised early in the service startup process, and
 * all controller decorators assign routes to this singleton. Eventually, we attach this router to the Express instance.
 */
export const router = Router();
