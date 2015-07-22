---
layout: doc
title: Changes
---

1.0.1 / 2015-07-22
==================

  * 1.0.1
  * Added change log, added docs for routing and route files.
  * Update package.json files entry
  * Added licence file

1.0.0 / 2015-07-21
==================
  * 1.0.0
  * Added documentation site.
  * Expose the default middleware stack and allow it to be altered.
  * Route definitions now derived from file path.

0.3.0 / 2015-07-16
==================

  * 0.3.0
  * Added path-parse polyfill for 10.x tests
  * Path routes based on file structure, rather than returned object.

0.2.7 / 2015-07-03
==================

  * 0.2.7
  * Added no op function check to Pomegranate#start

0.2.6 / 2015-07-01
==================

  * 0.2.6
  * Added config option to render errors vs sending JSON response

0.2.5 / 2015-07-01
==================

  * 0.2.5
  * Finalized favicon path handling

0.2.4 / 2015-07-01
==================

  * 0.2.4
  * Fixed pathing issue when running under a process manager or from parent cli app

0.2.3 / 2015-07-01
==================

  * 0.2.3
  * Add additional check for valid favicon file

0.2.2 / 2015-07-01
==================

  * 0.2.2
  * Expose handlebars registerPartials via config setting

0.2.1 / 2015-07-01
==================

  * 0.2.1
  * Moved controller loader to async api.
  * Updated hiredis to v0.4.0, was killing builds on iojs v2.x.x

0.2.0 / 2015-06-18
==================

  * 0.2.0
  * mirrored MagnumDI API in Pomegranate#addDependency

0.1.0 / 2015-06-16
==================

  * 0.1.0
  * Update Dependencies

0.0.7 / 2015-06-15
==================

  * 0.0.7
  * Added Controllers to the mix

0.0.6 / 2015-05-23
==================

  * 0.0.6
  * CouchLoader now handles multiple view definitions

0.0.5 / 2015-05-22
==================

  * 0.0.5
  * Finished Couch Model loading, still needs better error handlers
  * Point example link to correct location

0.0.4 / 2015-05-19
==================

  * 0.0.4
  * Adding support for couch

0.0.3 / 2015-05-13
==================

  * 0.0.3
  * Code reorganization, moved DI module to its own project, added assets.
    * Grouped bare files into directories.
    * The Dependency Injection Module has been moved into its own project at PaperElectron/Magnum-DI
    * Added favicon file and source.

0.0.2 / 2015-05-07
==================

  * 0.0.2
  * IoC


0.0.1 / 2015-04-30
==================

  * 0.0.1
  * Name change
  * Initial commit