# Documentation topics

### Application plugins

Application Plugins are logical grouping of plugins, that may restrict the dependencies they produce to the
scope of their applications MagnumDI instance.

Further, plugins outside of the application can join it, provided they are in the same namespace.(For now) By setting
configuration.applicationMember: ['lineage','path', 'of', 'application']

### Injector Scopes

A plugin can restrict the availability of its injectable to one of the following scopes.

- global
- namespace
- application