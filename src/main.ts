import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import { format } from 'date-fns';
import * as session from "express-session"
import * as passport from "passport"
const cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );
  app.enableCors();
  const logger = new Logger('bootstrap');
  const config = new DocumentBuilder()
    .setTitle('Facebook page Management')
    .setDescription('The task management API description')
    .setVersion('1.0')
    .addTag('tasks')
    .addTag('user')
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    })
    .build();
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      name: 'acc-facebook-session',
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    }),)
    
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/page'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/page'));
  hbs.registerHelper("when", function (operand_1, operator, operand_2, options) {
    let operators = {
      'eq': function (l, r) { return l == r; },
      'noteq': function (l, r) { return l != r; },
      'gt': function (l, r) { return Number(l) > Number(r); },
      'or': function (l, r) { return l || r; },
      'and': function (l, r) { return l && r; },
      '%': function (l, r) { return (l % r) === 0; }
    }
      , result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
  });
  hbs.registerHelper('formatDate', function (isoDate: string) {
    const date = new Date(isoDate);
    return format(
      date,
      'yyyy-MM-dd HH:mm:ss',
    );
  });
  hbs.registerHelper('count', function (data: any[]) {
    if (!data) {
      return 0;
    }
    return data.length
  });
  hbs.registerHelper('postMessage', function (data: any) {
    if (!data) {
      return '---no message on this post---';
    }
    return data
  });
  hbs.registerHelper("increment", function (value, options) {
    return parseInt(value) + 1;
  });
  hbs.registerHelper("first_element", function (data: any[]) {
    return data[0];
  });
  hbs.registerHelper('vue-js', function (options) {
    return options.fn();
  });
  app.setViewEngine('hbs');
  const port = process.env.PORT || 8000;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
