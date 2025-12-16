# Database Migration Note

## Charity Coins Field Added

The `charityCoins` field was added to the User schema. 

### For Existing Users

If you have existing users in MongoDB created before this update, they won't have the `charityCoins` field. The backend code handles this by returning `0` if the field doesn't exist.

### To Update Existing Users in MongoDB

If you want to add the `charityCoins` field to all existing users, run this in MongoDB Compass or mongosh:

```javascript
db.users.updateMany(
  { charityCoins: { $exists: false } },
  { $set: { charityCoins: 0 } }
)
```

This will:
- Find all users without a `charityCoins` field
- Add `charityCoins: 0` to them

### Verify in MongoDB Compass

After the migration, you should see the `charityCoins` field for all users when viewing the `users` collection.
