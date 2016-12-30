import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Types = Schema.Types;

module.exports = () => {
  const tournamentSchema = new Schema({
    user: {
      type: Types.String,
      minLength: 1,
      required: true,
      trim: true,
    },
    name: {
      type: Types.String,
      minLength: 3,
      required: true,
      trim: true,
    },
    date: {
      type: Types.String,
      match: /^20\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/,
      required: true,
    },
    tournament: {
      type: Types.Mixed,
      required: true,
    },
  }, { timestamps: true });

  return mongoose.model('Tournament', tournamentSchema);
};
