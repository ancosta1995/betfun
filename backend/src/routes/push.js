// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const Notification = require("../models/Notification");

/**
 * @route   GET /api/push/notifications
 * @desc    Get notifications for the authenticated user
 * @access  Private
 */
router.get("/notifications", validateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for existing welcome gift notification
    const existingWelcomeNotification = await Notification.findOne({
      userId,
      category: 'gift',
      title: 'Welcome Gift!',
    });

    if (!existingWelcomeNotification) {
      const welcomeNotification = new Notification({
        userId,
        category: 'gift',
        title: 'Welcome Gift!',
        description: 'You have received a special welcome gift! 🎁 Enjoy!',
        icon: 'FaGift',
      });

      await welcomeNotification.save();
    }

    // Check for existing booster notification
    const existingBoosterNotification = await Notification.findOne({
      userId,
      category: 'boost', // Change 'booster' to 'boost'
      title: 'Deposit Bonus!',
    });

    if (!existingBoosterNotification) {
      const boosterNotification = new Notification({
        userId,
        category: 'boost', // Change 'booster' to 'boost'
        title: 'Deposit Bonus!',
        description: 'Deposit now and get a 200% bonus! 🚀 25x wager to unlock.',
        icon: 'FaRocket',
      });

      await boosterNotification.save();
    }

    // Fetch all notifications for the user
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });

    // Update all notifications for the user to mark as read
    await Notification.updateMany({ userId }, { isRead: true });

    res.json({ notifications }); // Send notifications back in the response
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error });
  }
});

/**
 * @route   PUT /api/push/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put("/notifications/:id/read", validateJWT, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;

    // Update the notification to mark it as read
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found or already read' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification as read', error });
  }
});

module.exports = router;
