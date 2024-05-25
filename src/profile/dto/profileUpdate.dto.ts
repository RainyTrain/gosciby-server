import { PartialType } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class ProfileUpdateDto extends PartialType(ProfileDto) {}
