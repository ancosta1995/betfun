const mongoose = require('mongoose');

// Bildirim modelini oluşturuyoruz
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Bildirim hangi kullanıcıya ait olduğunu belirtiyor
    required: true,
  },
  category: {
    type: String,
    enum: ['race', 'wallet', 'rain', 'gift', 'party', 'boost'], // Kategoriler belirleniyor
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String, // İcon belirtebiliriz, frontend tarafında ikon seti ile eşleşebilir
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Bildirim zamanını kaydediyoruz
  },
  isRead: {
    type: Boolean,
    default: false, // Bildirimin okunup okunmadığı bilgisi
  },
});

// Modeli dışa aktarıyoruz
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
