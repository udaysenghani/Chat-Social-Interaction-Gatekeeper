import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesModule } from './messages/messages.module';
import { MaliciousActivityModule } from './malicious-activity/malicious-activity.module';
import { BatchModule } from './batch/batch.module';
import { AiModule } from './ai/ai.module';
import { EnforcementModule } from './enforcement/enforcement.module';
import { WebsocketModule } from './websocket/websocket.module';
import { AdminModule } from './admin/admin.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { ChatModule } from './websocket/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 🌍 Global config
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),

    // 🔐 AUTH FIRST (CRITICAL)
    AuthModule,

    // 🗄️ Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: false,
        logging: false,
      }),
    }),

    MessagesModule,
    MaliciousActivityModule,
    BatchModule,
    AiModule,
    EnforcementModule,
    WebsocketModule, // ✅ ONLY THIS
    AdminModule,
  ],
})
export class AppModule {}