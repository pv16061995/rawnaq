<?php

namespace common\modules\settings\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class SocialMediaSettings extends BaseSettingsModel
{
    const GROUP = 'social';

    public $fb_link;
    public $tw_link;
    public $yt_link;
    public $ld_link;
    public $in_link;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return ArrayHelper::merge(parent::rules(),
            [
                [['fb_link','tw_link', 'yt_link', 'ld_link', 'in_link'], 'safe'],
            ]);
    }

    public function attributeLabels()
    {
        return [
            'fb_link' => Yii::t('yee/settings', 'Facebook Link'),
            'tw_link' => Yii::t('yee/settings', 'Twitter Link'),
            'yt_link' => Yii::t('yee/settings', 'Youtube Link'),
            'ld_link' => Yii::t('yee/settings', 'LinkedIn Link'),
            'in_link' => Yii::t('yee/settings', 'Instagram Link'),
            
        ];
    }

}