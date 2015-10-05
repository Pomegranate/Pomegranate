/**
 * @file CustomErrors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var util = require('util');

/**
 * Holds Sequelize and other custom errors.
 * @module CustomErrors
 */

module.exports = function(Sequelize) {
  return {
    ResourceRequiredError: ResourceRequiredError,
    ResourceNotFoundError: ResourceNotFoundError,
    ResourceLimitedError: ResourceLimitedError,
    ResourceOwnerError: ResourceOwnerError,
    ResourceDeleteConstraintError: ResourceDeleteConstraintError,
    ApiTimedOutError: ApiTimedOutError,
    ParametersRequiredError: ParametersRequiredError,
    ValidationError: Sequelize.ValidationError,
    UniqueConstraintError: Sequelize.UniqueConstraintError,
    ExclusionConstraintError: Sequelize.ExclusionConstraintError,
    ForeignKeyConstraintError: Sequelize.ForeignKeyConstraintError,
    handle: function(status, msg) {
      return function(err, req, res, next) {
        var errorStatus = req.errorStatus || err.defaultStatusCode || 500;
        var response = {
          status: err.message || 'Sorry Something went wrong.',
          err: true,
          path: req.originalUrl || false,
          method: req.method
        };
        if(err.errors) {
          response.err = err.errors.map(function(v) {
            return {message: v.message, type: v.type}
          })
        }
        return res.status(errorStatus).json(response)
      }
    },

    capture: function(next, code) {
      return function(err) {
        err.defaultStatusCode = code || 500;
        return next(err)
      }
    }
  }
};

/**
 * Resource Required Error - The resource is missing data needed to continue.
 * @constructor
 */
function ResourceRequiredError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ResourceRequiredError';
  this.message = thisErr.message;
  this.defaultStatusCode = 400;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ResourceRequiredError, Error);

/**
 * ResourceLimited - The maximum number of this resource has been met.
 * @constructor
 */
function ResourceNotFoundError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ResourceNotFoundError';
  this.message = thisErr.message;
  this.defaultStatusCode = 404;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ResourceNotFoundError, Error);

/**
 * ResourceLimited - The maximum number of this resource has been met.
 * @constructor
 */
function ResourceLimitedError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ResourceLimitedError';
  this.message = thisErr.message;
  this.defaultStatusCode = 400;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ResourceLimitedError, Error);

/**
 * ResourceOwner - This resource can only be Updated by its owner.
 * @constructor
 */
function ResourceOwnerError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ResourceOwnerError';
  this.message = thisErr.message;
  this.defaultStatusCode = 401;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ResourceOwnerError, Error);

/**
 * Resource Delete Constraint - This resource can not be deleted due to a constraint.
 * @constructor
 */
function ResourceDeleteConstraintError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ResourceDeleteConstraintError';
  this.message = thisErr.message;
  this.defaultStatusCode = 400;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ResourceDeleteConstraintError, Error);

/**
 * Api Timed Out - The request to the api server timed out.
 * @constructor
 */
function ApiTimedOutError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ApiTimedOutError';
  this.message = thisErr.message
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ApiTimedOutError, Error);

/**
 * Parameters Required - The request requires additional parameters to continue.
 * @constructor
 */
function ParametersRequiredError() {
  var thisErr = Error.apply(this, arguments);
  thisErr.name = this.name = 'ParametersRequiredError';
  this.message = thisErr.message;
  this.defaultStatusCode = 400;
  if(Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
}
util.inherits(ParametersRequiredError, Error);