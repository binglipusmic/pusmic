package com.pusmicgame.utils

import com.pusmicgame.domain.GameUserPlatObj

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

/**
 * Created by prominic2 on 17/1/9.
 */
import com.pusmicgame.game.GameUser
class CustomComparatorForGameUserPlatObj implements  Comparator<GameUserPlatObj>{
    @Override
    public int compare(GameUserPlatObj o1, GameUserPlatObj o2) {
        // TODO Auto-generated method stub
        return o1.id.compareTo(o2.id);

    }
}
