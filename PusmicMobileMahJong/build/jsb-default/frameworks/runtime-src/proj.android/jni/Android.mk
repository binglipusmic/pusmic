LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := hellojavascript/main.cpp \
				   ../../Classes/AppDelegate.cpp \
				   ../../Classes/SDKManager.cpp \
				   ../../Classes/jsb_anysdk_basic_conversions.cpp \
				   ../../Classes/manualanysdkbindings.cpp \
				   ../../Classes/jsb_anysdk_protocols_auto.cpp
LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes

LOCAL_STATIC_LIBRARIES := cocos2d_js_static
LOCAL_WHOLE_STATIC_LIBRARIES := PluginProtocolStatic

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)

include $(CLEAR_VARS)

LAME_LIBMP3_DIR := lame_3.99.5_libmp3lame
LOCAL_CFLAGS += -DSTDC_HEADERS
LOCAL_MODULE    := mp3lame
LOCAL_SRC_FILES := $(LAME_LIBMP3_DIR)/bitstream.c $(LAME_LIBMP3_DIR)/fft.c $(LAME_LIBMP3_DIR)/id3tag.c $(LAME_LIBMP3_DIR)/mpglib_interface.c $(LAME_LIBMP3_DIR)/presets.c $(LAME_LIBMP3_DIR)/quantize.c $(LAME_LIBMP3_DIR)/reservoir.c $(LAME_LIBMP3_DIR)/tables.c $(LAME_LIBMP3_DIR)/util.c $(LAME_LIBMP3_DIR)/VbrTag.c $(LAME_LIBMP3_DIR)/encoder.c $(LAME_LIBMP3_DIR)/gain_analysis.c $(LAME_LIBMP3_DIR)/lame.c $(LAME_LIBMP3_DIR)/newmdct.c $(LAME_LIBMP3_DIR)/psymodel.c $(LAME_LIBMP3_DIR)/quantize_pvt.c $(LAME_LIBMP3_DIR)/set_get.c $(LAME_LIBMP3_DIR)/takehiro.c $(LAME_LIBMP3_DIR)/vbrquantize.c $(LAME_LIBMP3_DIR)/version.c lame_util.c
APP_CFLAGS += -DSTDC_HEADERS

include $(BUILD_SHARED_LIBRARY)

$(call import-module, scripting/js-bindings/proj.android)
