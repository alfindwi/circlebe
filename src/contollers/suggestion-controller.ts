import { Request, Response } from "express";
import suggestionService from "../services/suggestion-service";

class SuggestionController {
  async getSuggestions(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      const suggestions = await suggestionService.getSuggestions(userId);
      return res.json(suggestions);
    } catch (error) {
      return res.status(500).json({ message: "An error occurred", error });
    }
  }
}

export default new SuggestionController();
