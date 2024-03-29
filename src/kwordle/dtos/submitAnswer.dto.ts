import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  Length,
} from 'class-validator';

@InputType()
export class SubmitAnswerInputDto {
  @Field(() => [String], { description: '유저가 입력한 답안' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(6)
  @ArrayMinSize(6)
  answer: string[];
}
export type CheckAnswerInputDto = SubmitAnswerInputDto;

export enum ANSWER_FLAG_ENUM {
  'OUT' = 'OUT',
  'STRIKE' = 'STRIKE',
  'BALL' = 'BALL',
}
export type ANSWER_FLAG_TYPE = keyof typeof ANSWER_FLAG_ENUM;

registerEnumType(ANSWER_FLAG_ENUM, {
  name: 'ANSWER_FLAG',
  description: `각 글자의 정답 정도를 알려주기 위해 사용하는 ENUM, 숫자 야구 게임에서 착안. 
  예시) 정답:  "ㅅㅓㅣㄱ ㅕㅣ"(세계) 
       제출답안: "ㄱㅗㄱㅜㅁㅏ"(고구마) => ["BALL", "OUT", "BALL", "OUT", "OUT", "OUT"]
       제출답안: "ㅅㅓㅣㄱㅡㅁ"(세금) => ["STRIKE", "STRIKE", "STRIKE", "STRIKE", "OUT", "OUT"]`,
  valuesMap: {
    STRIKE: { description: '입력받은 글자의 위치가 정답과 정확하게 맞는 경우' },
    BALL: {
      description:
        '해당 글자가 입력받은 위치는 아니지만, 다른 곳에 해당되는 경우',
    },
    OUT: { description: '해당 글자가 정답의 어느 위치에도 없는 경우' },
  },
});

@ObjectType()
export class SubmitAnswerOutputDto {
  @Field(() => Boolean, { description: '정답 여부' })
  correctFlag: boolean;

  @Field(() => [ANSWER_FLAG_ENUM], { description: '글자 위치별 일치 여부' })
  correctList: ANSWER_FLAG_TYPE[];

  @Field(() => String, { nullable: true })
  answer?: string;
}

export type CheckAnswerOutputDto = SubmitAnswerOutputDto;
