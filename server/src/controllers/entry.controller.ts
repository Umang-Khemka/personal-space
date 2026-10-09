import type { Response, Request } from "express";
import mongoose from "mongoose";
import Entry from "../models/Entry.js";

const entryTypes = ["diary", "thought", "coding", "memory", "other"];
const moods = [
  "happy",
  "calm",
  "excited",
  "grateful",
  "neutral",
  "sad",
  "anxious",
  "stressed",
  "tired",
  "angry",
  "other",
];
const entryStatuses = ["draft", "complete"];

export const createEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { title, content, type, tags, mood, entryDate, isFavorite, status } =
      req.body;

    if (typeof content !== "string" || !content.trim()) {
      res.status(400).json({ message: "Content is required" });
      return;
    }

    if (content.length > 100000) {
      res.status(400).json({ message: "Content is too long" });
      return;
    }

    if (title !== undefined && typeof title !== "string") {
      res.status(400).json({ message: "Invalid title" });
      return;
    }

    if (title && title.trim().length > 150) {
      res.status(400).json({ message: "Title is too long" });
      return;
    }

    if (type !== undefined && !entryTypes.includes(type)) {
      res.status(400).json({ message: "Invalid entry type" });
      return;
    }

    if (mood !== undefined && !moods.includes(mood)) {
      res.status(400).json({ message: "Invalid mood" });
      return;
    }

    if (status !== undefined && !entryStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    if (
      tags !== undefined &&
      (!Array.isArray(tags) ||
        !tags.every((tag: unknown) => typeof tag === "string"))
    ) {
      res.status(400).json({ message: "Tags must be an array of strings" });
      return;
    }

    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      res.status(400).json({ message: "Invalid favorite value" });
      return;
    }

    let parsedEntryDate: Date | undefined;

    if (entryDate !== undefined) {
      if (typeof entryDate !== "string" && typeof entryDate !== "number") {
        res.status(400).json({ message: "Invalid entry date" });
        return;
      }

      parsedEntryDate = new Date(entryDate);

      if (Number.isNaN(parsedEntryDate.getTime())) {
        res.status(400).json({ message: "Invalid entry date" });
        return;
      }
    }
    const entry = await Entry.create({
      user: req.userId,
      content: content.trim(),
      ...(title !== undefined && { title: title.trim() }),
      ...(type !== undefined && { type }),
      ...(tags !== undefined && {
        tags: tags.map((tag: string) => tag.trim().toLowerCase()),
      }),
      ...(mood !== undefined && { mood }),
      ...(parsedEntryDate !== undefined && {
        entryDate: parsedEntryDate,
      }),
      ...(isFavorite !== undefined && { isFavorite }),
      ...(status !== undefined && { status }),
    });

    res.status(201).json({
      message: "Entry created successfully",
      entry,
    });
  } catch (error: unknown) {
    console.error("Create entry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEntries = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      search,
      type,
      mood,
      favorite,
      from,
      to,
      sort,
      page = "1",
      limit = "10",
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      pageNumber < 1 ||
      !Number.isInteger(limitNumber) ||
      limitNumber < 1 ||
      limitNumber > 100
    ) {
      res.status(400).json({ message: "Invalid pagination values" });
      return;
    }

    const filter: Record<string, unknown> = {
      user: req.userId,
    };

    const validTypes = ["diary", "thought", "coding", "memory", "other"];

    const validMoods = [
      "happy",
      "calm",
      "excited",
      "grateful",
      "neutral",
      "sad",
      "anxious",
      "stressed",
      "tired",
      "angry",
      "other",
    ];

    if (type) {
      if (typeof type !== "string" || !validTypes.includes(type)) {
        res.status(400).json({ message: "Invalid entry type" });
        return;
      }

      filter.type = type;
    }

    if (mood) {
      if (typeof mood !== "string" || !validMoods.includes(mood)) {
        res.status(400).json({ message: "Invalid mood" });
        return;
      }

      filter.mood = mood;
    }

    if (favorite !== undefined) {
      if (favorite !== "true" && favorite !== "false") {
        res.status(400).json({ message: "Invalid favorite value" });
        return;
      }

      filter.isFavorite = favorite === "true";
    }

    if (search !== undefined) {
      if (typeof search !== "string") {
        res.status(400).json({ message: "Invalid search value" });
        return;
      }

      const term = search.trim().slice(0, 100);

      if (term) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "i");

        filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
      }
    }

    if (from || to) {
      const dateFilter: Record<string, Date> = {};

      const isValidDate = (value: unknown): value is string =>
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
        new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value);

      if (from) {
        if (!isValidDate(from)) {
          res.status(400).json({ message: "Invalid from date" });
          return;
        }

        dateFilter.$gte = new Date(`${from}T00:00:00.000Z`);
      }

      if (to) {
        if (!isValidDate(to)) {
          res.status(400).json({ message: "Invalid to date" });
          return;
        }

        dateFilter.$lt = new Date(
          new Date(`${to}T00:00:00.000Z`).getTime() + 86400000,
        );
      }

      if (
        dateFilter.$gte &&
        dateFilter.$lt &&
        dateFilter.$gte >= dateFilter.$lt
      ) {
        res.status(400).json({ message: "Invalid date range" });
        return;
      }

      filter.entryDate = dateFilter;
    }

    const sortOrder = sort === "oldest" ? 1 : -1;

    const skip = (pageNumber - 1) * limitNumber;

    const [entries, total] = await Promise.all([
      Entry.find(filter)
        .sort({ entryDate: sortOrder, createdAt: sortOrder })
        .skip(skip)
        .limit(limitNumber),
      Entry.countDocuments(filter),
    ]);

    res.status(200).json({
      entries,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasMore: skip + entries.length < total,
      },
    });
  } catch (error) {
    console.error("Get entries error:", error);
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

export const getEntryById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid entry ID" });
      return;
    }

    const entry = await Entry.findOne({
      _id: id,
      user: req.userId,
    });

    if (!entry) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    res.status(200).json({ entry });
  } catch (error: unknown) {
    console.error("Get entry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid entry ID" });
      return;
    }

    const allowedFields = [
      "title",
      "content",
      "type",
      "tags",
      "mood",
      "entryDate",
      "isFavorite",
      "status",
    ];

    const updates = req.body as Record<string, unknown>;
    const keys = Object.keys(updates);

    if (keys.length === 0 || keys.some((key) => !allowedFields.includes(key))) {
      res.status(400).json({ message: "Invalid update fields" });
      return;
    }

    if (
      "content" in updates &&
      (typeof updates.content !== "string" ||
        !updates.content.trim() ||
        updates.content.length > 100000)
    ) {
      res.status(400).json({ message: "Invalid content" });
      return;
    }

    if (
      "title" in updates &&
      (typeof updates.title !== "string" || updates.title.trim().length > 150)
    ) {
      res.status(400).json({ message: "Invalid title" });
      return;
    }

    if (
      "type" in updates &&
      (typeof updates.type !== "string" || !entryTypes.includes(updates.type))
    ) {
      res.status(400).json({ message: "Invalid entry type" });
      return;
    }

    if (
      "mood" in updates &&
      updates.mood !== undefined &&
      (typeof updates.mood !== "string" || !moods.includes(updates.mood))
    ) {
      res.status(400).json({ message: "Invalid mood" });
      return;
    }

    if (
      "status" in updates &&
      (typeof updates.status !== "string" ||
        !entryStatuses.includes(updates.status))
    ) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    if (
      "tags" in updates &&
      (!Array.isArray(updates.tags) ||
        !updates.tags.every((tag: unknown) => typeof tag === "string"))
    ) {
      res.status(400).json({ message: "Tags must be an array of strings" });
      return;
    }

    if ("isFavorite" in updates && typeof updates.isFavorite !== "boolean") {
      res.status(400).json({ message: "Invalid favorite value" });
      return;
    }

    if ("entryDate" in updates) {
      if (
        typeof updates.entryDate !== "string" &&
        typeof updates.entryDate !== "number"
      ) {
        res.status(400).json({ message: "Invalid entry date" });
        return;
      }

      const date = new Date(updates.entryDate);

      if (Number.isNaN(date.getTime())) {
        res.status(400).json({ message: "Invalid entry date" });
        return;
      }

      updates.entryDate = date;
    }

    if ("title" in updates && typeof updates.title === "string") {
      updates.title = updates.title.trim();
    }

    if ("content" in updates && typeof updates.content === "string") {
      updates.content = updates.content.trim();
    }

    if ("tags" in updates && Array.isArray(updates.tags)) {
      updates.tags = updates.tags.map((tag: string) =>
        tag.trim().toLowerCase(),
      );
    }

    const entry = await Entry.findOneAndUpdate(
      { _id: id, user: req.userId },
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!entry) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    res.status(200).json({
      message: "Entry updated successfully",
      entry,
    });
  } catch (error: unknown) {
    console.error("Update entry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteEntry = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;

    if (!id || !mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "Invalid entry ID" });
      return;
    }

    const entry = await Entry.findOneAndDelete({
      _id: id,
      user: req.userId,
    });

    if (!entry) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error: unknown) {
    console.error("Delete entry error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCalendarEntries = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { month } = req.query;

    if (typeof month !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      res.status(400).json({
        message: "month must be in YYYY-MM format",
      });
      return;
    }

    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));

    const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNumber, 1));

    const entries = await Entry.find({
      user: req.userId,
      entryDate: {
        $gte: startDate,
        $lt: endDate,
      },
    })
      .select("_id title type mood entryDate isFavorite status")
      .sort({ entryDate: 1 });

    res.status(200).json({ entries });
  } catch (error) {
    console.error("Calendar entries error:", error);
    res.status(500).json({
      message: "Failed to fetch calendar entries",
    });
  }
};

export const getMemories = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const day = now.getUTCDate();

    const startDate = new Date(Date.UTC(year, month, day));
    const endDate = new Date(Date.UTC(year, month, day + 1));

    const entries = await Entry.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          entryDate: {
            $lt: startDate,
          },
        },
      },
      {
        $match: {
          $expr: {
            $and: [
              {
                $eq: [{ $month: "$entryDate" }, month + 1],
              },
              {
                $eq: [{ $dayOfMonth: "$entryDate" }, day],
              },
            ],
          },
        },
      },
      {
        $sort: { entryDate: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          type: 1,
          mood: 1,
          entryDate: 1,
          isFavorite: 1,
        },
      },
    ]);

    res.status(200).json({ entries });
  } catch (error) {
    console.error("Memories error:", error);
    res.status(500).json({
      message: "Failed to fetch memories",
    });
  }
};

export const getMoodStats = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { from, to } = req.query;

    const dateFilter: Record<string, Date> = {};

    const isValidDate = (value: unknown): value is string =>
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
      new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value);

    if (from) {
      if (!isValidDate(from)) {
        res.status(400).json({ message: "Invalid from date" });
        return;
      }

      dateFilter.$gte = new Date(`${from}T00:00:00.000Z`);
    }

    if (to) {
      if (!isValidDate(to)) {
        res.status(400).json({ message: "Invalid to date" });
        return;
      }

      dateFilter.$lt = new Date(
        new Date(`${to}T00:00:00.000Z`).getTime() + 86400000,
      );
    }

    if (
      dateFilter.$gte &&
      dateFilter.$lt &&
      dateFilter.$gte >= dateFilter.$lt
    ) {
      res.status(400).json({ message: "Invalid date range" });
      return;
    }

    const match: Record<string, unknown> = {
      user: new mongoose.Types.ObjectId(req.userId),
    };

    if (Object.keys(dateFilter).length > 0) {
      match.entryDate = dateFilter;
    }

    const moods = await Entry.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ["$mood", "unset"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          mood: "$_id",
          count: 1,
        },
      },
    ]);

    const totalEntries = moods.reduce((sum, item) => sum + item.count, 0);

    res.status(200).json({
      totalEntries,
      moods,
    });
  } catch (error) {
    console.error("Mood stats error:", error);
    res.status(500).json({
      message: "Failed to fetch mood statistics",
    });
  }
};
