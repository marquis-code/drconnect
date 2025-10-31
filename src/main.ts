import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ConfigService } from "@nestjs/config"
import compression from "compression"
import helmet from "helmet"
import { AppModule } from "./app.module"
import mongoose from "mongoose"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)


    // Database connection events
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected')
  })

  // Security and performance middleware
  app.use(compression())
  app.use(helmet())

  const allowedOrigins =
    configService.get("ALLOWED_ORIGINS") ||
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:5173"

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true)
      }

      const origins = allowedOrigins.split(",")

      // Check if the origin is allowed
      if (origins.indexOf(origin) !== -1 || origins.includes("*")) {
        return callback(null, true)
      } else {
        console.log(`Blocked request from: ${origin}`)
        return callback(null, true) // Still allow for now, but log it
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    exposedHeaders: ["Content-Disposition"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle("Olgnova API")
    .setDescription("Olgnova Research API")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

    // Add security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});
  

  // Start the server
  const port = configService.get<number>("PORT") || 3001
  await app.listen(port)
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()