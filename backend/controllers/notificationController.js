import Notification from "../models/Notification.js";


// ➕ CREATE (ADMIN)
export const createNotification = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path;

    const notification = await Notification.create({
      title,
      description,
      image,
    });

    res.status(201).json(notification);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};


// 🌍 GET ALL ACTIVE (PUBLIC)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


// 👑 ADMIN: GET ALL (INCLUDING INACTIVE)
export const getAllNotificationsAdmin = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


// ✏️ UPDATE
export const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Not found" });
    }

    const { title, description, isActive } = req.body;

    if (title) notification.title = title;
    if (description) notification.description = description;
    if (isActive !== undefined) notification.isActive = isActive;

    if (req.file) {
      notification.image = req.file.path;
    }

    await notification.save();

    res.json(notification);

  } catch (error) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};


// ❌ DELETE
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};