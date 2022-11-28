package com.synergy.api.controller;

import com.synergy.api.request.UserSubjectCreatePostReq;
import com.synergy.api.response.BodytalkRes;
import com.synergy.api.response.SubjectSetRes;
import com.synergy.api.service.SubjectService;
import com.synergy.api.service.UserService;
import com.synergy.common.auth.UserDetails;
import com.synergy.common.model.response.BaseResponseBody;
import com.synergy.db.entity.Bodytalk;
import com.synergy.db.entity.BodytalkDto;
import com.synergy.db.entity.SubjectSetDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@Api(value = "게임설정 API", tags = {"Subject", "Bodytalk", "Goldenbell"})
@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final Logger log = LoggerFactory.getLogger(ChannelController.class);

    @Autowired
    SubjectService subjectService;

    @GetMapping("")
    @ApiOperation(value = "문제집 리스트 조회", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 조회 완료"),
            @ApiResponse(code = 404, message = "문제집이 없습니다."),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> getSubjects(@ApiIgnore Authentication authentication){
        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());
        List<SubjectSetDto> list = null;
        //0번은 기본의 문제집
        list = subjectService.getSubjectSets(Arrays.asList(1L, userId));
        if(list.size() == 0) {
            return ResponseEntity.status(404).body(SubjectSetRes.of(404, "문제집이 없습니다."));
        }
        return ResponseEntity.status(200).body(SubjectSetRes.of(200, "문제집 조회 완료", list));

    }

    @GetMapping("/{subjectId}")
    @ApiOperation(value = "문제집 리스트 조회", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 조회 완료"),
            @ApiResponse(code = 403, message = "본인의 문제집만 조회 가능합니다."),
            @ApiResponse(code = 404, message = "문제집이 존재하지 않습니다.")
    })
    public ResponseEntity<? extends BaseResponseBody> getSubjects(@ApiIgnore Authentication authentication,
                                                                  @PathVariable(value = "subjectId") Long subjectId){

        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());

        // 본인의 문제집이 맞는지 검증
        try {
            Long subjectOwner = subjectService.getSubjectSet(subjectId).getUser().getId();
            if (subjectOwner != 1 && subjectOwner != userId) {
                return ResponseEntity.status(403).body(BodytalkRes.of(403, "본인의 문제집만 조회 가능합니다."));
            }
        } catch(NoSuchElementException exception) {
            return ResponseEntity.status(403).body(BodytalkRes.of(500, "문제집이 존재하지 않습니다."));
        }

        List<Bodytalk> list = subjectService.getBodytalk(subjectId);
        return ResponseEntity.status(200).body(BodytalkRes.of(200, "문제집 조회 완료", list));

    }



    @DeleteMapping("/{subjectId}")
    @ApiOperation(value = "문제집 삭제", notes = "문제집 과 문제들 삭제")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 & 문제 삭제 완료"),
            @ApiResponse(code = 403, message = "본인의 문제집만 삭제 가능합니다."),
            @ApiResponse(code = 404, message = "문제집이 존재하지 않습니다.")
    })
    public ResponseEntity<? extends BaseResponseBody> deleteOneSubject(@ApiIgnore Authentication authentication,
                                                                  @PathVariable(value = "subjectId") Long subjectId){

        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());

        // 본인의 문제집이 맞는지 검증
        try {
            Long subjectOwner = subjectService.getSubjectSet(subjectId).getUser().getId();
            if (subjectOwner != 1 && subjectOwner != userId) {
                return ResponseEntity.status(403).body(BodytalkRes.of(403, "본인의 문제집만 조회 가능합니다."));
            }
        } catch(NoSuchElementException exception) {
            return ResponseEntity.status(403).body(BodytalkRes.of(500, "문제집이 존재하지 않습니다."));
        }

        subjectService.deleteSubjectSet(subjectId);
        return new ResponseEntity<>(HttpStatus.OK);

    }

    @DeleteMapping("")
    @ApiOperation(value = "문제집들 전부 삭제", notes = "내 문제집 과 문제들 전부 삭제")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 & 문제 삭제 완료"),
            @ApiResponse(code = 403, message = "본인의 문제집만 삭제 가능합니다."),
    })
    public ResponseEntity<? extends BaseResponseBody> deleteALLSubject(@ApiIgnore Authentication authentication){

        UserDetails userDetails = (UserDetails)authentication.getDetails();
        Long userId = Long.valueOf(userDetails.getUsername());

        subjectService.deleteAllSubjectSet(userId);
        return new ResponseEntity<>(HttpStatus.OK);

    }



    @PostMapping("/create")
    @ApiOperation(value = "문제집 리스트 생성", notes = "기본 문제집과 유저가 만든 문제집에 대한 정보를 반환한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "문제집 생성완료")
    })
    public ResponseEntity<? extends BaseResponseBody> createSubjects(@ApiIgnore Authentication authentication,
                                                                     @RequestBody UserSubjectCreatePostReq userSubjectCreatePostReq) {

        UserDetails userDetails = (UserDetails)authentication.getDetails();


        subjectService.createSubjectSet(userSubjectCreatePostReq.getSubjectName()
                ,userDetails.getUser(), userSubjectCreatePostReq.getGameTitle()
                ,userSubjectCreatePostReq.getBodytalkList());


        return new ResponseEntity<>(HttpStatus.OK);
    }






}
