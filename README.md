# loopback-log-extension

log extension for LoopBack 4

Install `npm i loopback-log-extension --save`
or      `yarn add loopback-log-extension`

## Overview

This repository shows you how to use
[@loopback/cli](https://github.com/strongloop/loopback-next/tree/master/packages/cli)
to write a complex logging extension that requires a
[Component](http://loopback.io/doc/en/lb4/Using-components.html),
[Decorator](http://loopback.io/doc/en/lb4/Decorators.html), and a
[Mixin](http://loopback.io/doc/en/lb4/Mixin.html).

To use this extension you can add the `LogMixin` to your Application which will
provide you a function to set the Application wide log level as well as
automatically load the `LogComponent`. Only Controller methods configured at or
above the logLevel will be logged.

_You may alternatively load `LogComponent` yourself and set the log level using
the appropriate binding keys manually if you don't wish to use the `LogMixin`._

Possible levels are: DEBUG &lt; INFO &lt; WARN &lt; ERROR &lt; OFF

_Possible levels are represented as numbers but users can use
`LOG_LEVEL.${level}` to specify the value instead of using numbers._

A decorator enables you to set the log level for Controller methods, at or above
which it should be logged.

### Usage

###### 1. Create datasource to save token

Sample:

`datasources/token.datasource.config.json` file
```json
{
    "name": "token",
    "connector": "memory",
    "localStorage": "",
    "file": "../../data/token.json"
}
```

`datasources/token.datasource.ts` file
```ts
import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import { juggler } from '@loopback/repository';
import config from './token.datasource.config.json';
import * as path from 'path'

interface TokenDataSourceInterFace {
  name: string
  connector: string
  localStorage: string
  file: string
}

@lifeCycleObserver('datasource')
export class TokenDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'token';

  constructor(
    @inject('datasources.config.token', { optional: true })
    dsConfig: TokenDataSourceInterFace = config,
  ) {
    const newPath = path.join(__dirname, dsConfig.file)
    dsConfig.file = newPath
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

```


###### 2. Create Token Repository

`repositories/token.repository.ts` file
```ts
import { DefaultCrudRepository } from '@loopback/repository';
import { Token, TokenRelations } from 'loopback-elog-extention';
import { TokenDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class TokenRepository extends DefaultCrudRepository<
  Token,
  typeof Token.prototype.id,
  TokenRelations
  > {
  constructor(@inject('datasources.token') dataSource: TokenDataSource) {
    super(Token, dataSource);
  }
}

```


In `application.ts` file
```ts
import {LogMixin, LOG_BINDINGS} from 'loopback-log-extension';
import { TokenRepository } from './repositories';
// Other imports ...

class LogApp extends LogMixin(BootMixin(RestApplication)) {
  constructor(options?: ApplicationConfig) {
    super(options);

    this.projectRoot = __dirname;
    this.configure(LOG_BINDINGS.COMPONENT).to({
      enableElog: true
    })
    this.configure(LOG_BINDINGS.LOGGER).to({
      url: '${url_elog}',
      username: '${elog_username}',
      password: '${elog_password}',
      appCode: '${elog_appcode}',
      tokenRepo: TokenRepository
    })
  }
}
```

In `controllers/my.controller.ts` file
```ts
...

import {
  LOG_LEVEL,
  LOG_BINDINGS,
  ElogService,
  log
} from 'loopback-elog-extention';
class MyController {
  constructor(
    @inject(LOG_BINDINGS.LOGGER)
    private logger: ElogService
  ) { }

  @log({
    level: LOG_LEVEL.WARN,
    description: 'description for log',
    fn: {
      code: 'function code',
      name: 'function name'
    },
    // function parse request param for save to log
    parseInfo: () => {},
    // function parse result of method to get status of request and result code
    parseResult: result => { //result of method
      return {
        status: result.status,
        resultCode: result.responseCode
      }
    }
  })
  @get('/')
  hello() {
    ...
    this.logger.addTimeLine('test,', true, 'abc.txt', 'abc')
    ...
    return {
      status: true,
      resultCode: 'I001'
    };
  }
}
```

In `sequence.ts` file
```ts
...

import { LOG_BINDINGS, LogFn } from './loopback-elog-extention'
export class MySequence implements SequenceHandler {
  constructor(
    ...
    @inject(LOG_BINDINGS.LOG_ACTION)
    protected log: LogFn
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      const route = this.findRoute(request);

      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);

      this.log(request, args[0], result, true)
    } catch (err) {
      this.reject(context, err);
      this.log(context.request, context.request.body, err, false)
    }
  }
}
```
