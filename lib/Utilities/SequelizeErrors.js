/**
 * @file SequelizeErrors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * Handles Sequelize Errors
 * @module SequelizeErrors
 */

module.exports = function(Sequelize){
  return {
    ValidationError: Sequelize.ValidationError,
    UniqueConstraintError: Sequelize.UniqueConstraintError,
    ExclusionConstraintError: Sequelize.ExclusionConstraintError,
    ForeignKeyConstraintError: Sequelize.ForeignKeyConstraintError
  }
}