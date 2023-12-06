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
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/layouts'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerPartials(join(__dirname, '..', 'views/page'));
  hbsUtils(hbs).registerWatchedPartials(join(__dirname, '..', 'views/page'));
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
  app.setViewEngine('hbs');
  const port = 3000
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
