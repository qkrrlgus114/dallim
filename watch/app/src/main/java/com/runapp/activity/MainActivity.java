package com.runapp.activity;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Toast;

import androidx.activity.ComponentActivity;
import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.runapp.database.AppDatabase;
import com.runapp.databinding.ActivityMainBinding;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class MainActivity extends ComponentActivity {
    // 클래스 멤버로 Executor 정의
    private final Executor executor = Executors.newSingleThreadExecutor();
    private ActivityMainBinding binding;
    private AppDatabase db;
    static int MULTIPLE_PERMISSIONS_CODE = 100;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        db = AppDatabase.getDatabase(getApplicationContext());
        super.onCreate(savedInstanceState);

        // 알림을 사용하기 위한 코드(오레오 이상 버전이면 실행)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            /*새로운 알림 채널 생성
            * id : 채널의 아이디
            * name : 사용자에게 보여지는 채널 이름
            * 채널의 중요도 설정
            * */
            NotificationChannel serviceChannel = new NotificationChannel(
                    "dallim_channel",
                    "달림 알림",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            // 시스템에서 매니저를 가져와서 할당
            NotificationManager manager = getSystemService(NotificationManager.class);
            // 매니저를 사용해서 알림 채널을 시스템에 등록한다.
            manager.createNotificationChannel(serviceChannel);
        }

        // 바인딩 클래스를 사용해서 xml코드를 객체화시킨다. findViewById를 안 쓰고 바인딩 클래스로 편하게 사용.
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        // xml 레이아웃의 최상위 뷰를 가져옴
        View view = binding.getRoot();
        // 액티비티의 컨텐츠 뷰로 view를 설정. 여기서 화면에 뭐가 보일지 결정
        setContentView(view);

        // 어떤 권한을 확인할 지 설정 해놓은 메서드.
        checkPermission();

        // 시작 버튼을 클릭하면
        binding.btnStart.setOnClickListener(v -> {
            /*
            * Intent : 액티비티 간의 전환 또는 서비스를 시작할 때 사용하는 객체다.
            * 현재 액티비티에서 전환하려는 액티비티로 설정해주면 된다.
            * */
            Intent intent = new Intent(MainActivity.this, SelectActivity.class);
            startActivity(intent);
        });

    }

    private void checkPermission(){
        // 필요한 권한(퍼미션)들
        String[] requiredPermissions = {
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.ACTIVITY_RECOGNITION,
                Manifest.permission.BODY_SENSORS,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION
        };

        // 거절되었거나 아직 수락하지 않은 권한(퍼미션)을 저장할 문자열 리스트
        List<String> rejectedPermissionList = new ArrayList<>();

        // 필요한 퍼미션들을 하나씩 끄집어내서 현재 권한을 받았는지 체크
        for (String permission : requiredPermissions) {
            // 특정 퍼미션을 확인하는데 값이 PERMISSION_GRANTED와 같지 않으면 권한이 없다는 뜻.
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                // 만약 권한이 없다면 rejectedPermissionList에 추가
                rejectedPermissionList.add(permission);
            }
        }

        // 거절 퍼미션 리스트가 비어있지 않다면
        if (!rejectedPermissionList.isEmpty()) {
            // 권한 요청!
            String[] array = new String[rejectedPermissionList.size()];
            array = rejectedPermissionList.toArray(array);
            // 현재 액티비티에서 요청권한 리스트에게 다시 재요청을 보냄.
            ActivityCompat.requestPermissions(this, array, MULTIPLE_PERMISSIONS_CODE);
        }
    }

    /*
    * 요청에 대한 사용자의 권한 응답(승인 or 거절)을 받으면 실행된다.
    * onRequestPermissionsResult는 프래그먼트에서 사용되길 권장한다.
    * 하지만 메인 액티비티에서 권한 확인을 받는 게 맞아보여서 액티비티에서 사용함.
    */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        // 요청 코드가 우리가 보낸 권한요청의 결과와 맞는지 확인한다.(100)
        if (requestCode == MULTIPLE_PERMISSIONS_CODE) {
            boolean allPermissionsGranted = true;
            // 모든 권한이 승인되었는지 확인
            for (int grantResult : grantResults) {
                // 하나라도 승인이 안 됐으면 false로 만들고 정지
                if (grantResult != PackageManager.PERMISSION_GRANTED) {
                    allPermissionsGranted = false;
                    break;
                }
            }

            // 승인이 안 됐으면
            if (!allPermissionsGranted) {
                Toast.makeText(
                        getApplicationContext(),
                        "설정에서 모든 권한을 허용하고 다시 실행해주세요.",
                        Toast.LENGTH_LONG
                ).show();

                // 설정창으로 이동
                Intent intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                Uri uri = Uri.fromParts("package", getPackageName(), null);
                intent.setData(uri);
                startActivity(intent);
                finish();

            } else {
            }
        }
    }

}