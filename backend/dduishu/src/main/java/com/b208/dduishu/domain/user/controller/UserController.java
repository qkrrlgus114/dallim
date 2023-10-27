package com.b208.dduishu.domain.user.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.b208.dduishu.domain.user.dto.request.UserEmail;
import com.b208.dduishu.domain.user.dto.request.UserNickName;
import com.b208.dduishu.domain.user.dto.request.UserPoint;
import com.b208.dduishu.domain.user.dto.request.UserRankingInfo;
import com.b208.dduishu.domain.user.dto.response.CompareUserProfile;
import com.b208.dduishu.domain.user.dto.response.IsDuplicateNickName;
import com.b208.dduishu.domain.user.dto.response.SearchUserProfile;
import com.b208.dduishu.domain.user.dto.response.UserProfile;
import com.b208.dduishu.domain.user.service.UserRankingService;
import com.b208.dduishu.util.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.b208.dduishu.domain.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRankingService userRankingService;

    @PostMapping("/api/v1/user/token")
    public ApiResponse<?> getAccessToken(@RequestBody UserEmail req) {
        try {
            String token = userService.getAccessToken(req.getEmail());

            return ApiResponse.createSuccess(token);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }
    // 닉네임 중복 체크
    @PostMapping("/api/v1/user/check-nickname")
    public ApiResponse<?> checkUserNickname(@RequestBody UserNickName req){
        IsDuplicateNickName res = userService.checkUserNickname(req.getNickname());

        return ApiResponse.createSuccess(res);
    }

    // 닉네임 변경
    @PatchMapping("/api/v1/user/nickname")
    public ApiResponse<?> updateUserNickname(@RequestBody UserNickName req){
        try {
            userService.updateUserNickname(req.getNickname());

            return ApiResponse.createSuccess("닉네임 변경 성공");
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/point")
    public ApiResponse<?> getUserPoint() {
        try {
            UserPoint res = userService.getUserPoint();

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    // 프로필 사진 변경
    @PutMapping("/user/profile/update")
    public ResponseEntity<?> userProfileUpdate(@RequestParam("image") MultipartFile multipartFile) throws IOException {
        Map<String, Object> result = userService.userProfileImage(multipartFile);

        return ResponseEntity.status(200).body(result);
    }

    @GetMapping("/api/v1/user/follow-ranking")
    public ApiResponse<?> getWeeklyRankingWithFollower(@RequestParam int year, @RequestParam int month, @RequestParam int week) {
        try {
            List<UserRankingInfo> res = userRankingService.getWeeklyRankingWithFollower(year, month, week);

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/all-ranking")
    public ApiResponse<?> getWeeklyRankingWithAll(@RequestParam int year, @RequestParam int month, @RequestParam int week) {
        try {
            List<UserRankingInfo> res = userRankingService.getWeeklyRankingWithAll(year, month, week);

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/profile/me")
    public ApiResponse<?> getMyProfile() {
        try {
            UserProfile res = userService.getMyProfile();

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/profile/{id}")
    public ApiResponse<?> getUserProfile(@PathVariable Long id) {
        try {
            UserProfile res = userService.getUserProfile(id);

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/compare/{id}")
    public ApiResponse<?> compareUserProfile(@PathVariable Long id) {
        try {
            CompareUserProfile res = userService.compareUserProfile(id);

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }

    @GetMapping("/api/v1/user/search")
    public ApiResponse<?> searchUserProfile(@RequestParam String q) {
        try {
            List<SearchUserProfile> res = userService.searchUserProfile(q);

            return ApiResponse.createSuccess(res);
        } catch (Exception e) {
            return ApiResponse.createError(e.getMessage());
        }
    }
}
