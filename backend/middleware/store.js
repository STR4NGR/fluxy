import Store from '../models/Store.js';

const createShop = async function (next) {
    if (this.role === 'manager') {
        try {
            const existingStore = await Store.findOne({ user_id: this._id });
            if (!existingStore) {
                await Store.create({ user_id: this._id, name: this.name });
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
}

export default createShop;
