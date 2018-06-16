module.exports = (Models) => {
  Models.site.belongsTo(Models.user, {
    as: 'creator',
    foreignKey: 'creatorId',
  });

  Models.gallery.belongsTo(Models.site, {
    as: 'site',
    foreignKey: 'siteId',
  });
};

