 #!/bin/sh
 scp -i ~/work/PusmicGame2.pem ~/work/pusmic_game/PusmicMobileMahJong/assets/version.manifest ec2-user@ec2-54-223-138-159.cn-north-1.compute.amazonaws.com.cn:~/work/pusmic_game/PusmicMahJong/src/main/webapp/remote-assets/version.manifest
 scp -i ~/work/PusmicGame2.pem ~/work/pusmic_game/PusmicMobileMahJong/assets/project.manifest ec2-user@ec2-54-223-138-159.cn-north-1.compute.amazonaws.com.cn:~/work/pusmic_game/PusmicMahJong/src/main/webapp/remote-assets/project.manifest

 scp -i ~/work/PusmicGame2.pem -r ~/work/pusmic_game/PusmicMobileMahJong/build/jsb-default/res ec2-user@ec2-54-223-138-159.cn-north-1.compute.amazonaws.com.cn:~/work/pusmic_game/PusmicMahJong/src/main/webapp/remote-assets/
 scp -i ~/work/PusmicGame2.pem -r ~/work/pusmic_game/PusmicMobileMahJong/build/jsb-default/src ec2-user@ec2-54-223-138-159.cn-north-1.compute.amazonaws.com.cn:~/work/pusmic_game/PusmicMahJong/src/main/webapp/remote-assets/