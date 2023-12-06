import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateNewPostDto {
    message: string;
    link: string;
    published: boolean;
}