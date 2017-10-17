import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Types = Schema.Types;

module.exports = () => {
  const notificationSchema = new Schema({
    tournament: {
      type: Types.ObjectId,
      required: true,
    },
    endpoint: {
      type: Types.String,
      required: true,
    },
    keys: {
      p256dh: {
        type: Types.String,
        required: true,
      },
      auth: {
        type: Types.String,
        required: true,
      },
    },
  }, { timestamps: true });

  return mongoose.model('Notification', notificationSchema);
};
