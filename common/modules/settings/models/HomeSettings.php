<?php

namespace common\modules\settings\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * @author Muhammad Zakir Mughal <zakirmughal89@gmail.com>
 */
class HomeSettings extends BaseSettingsModel
{
    const GROUP = 'home';

    public $banner_img;
    public $banner_heading;
    public $banner_description;
    public $banner_page_link;
    public $content_text;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return ArrayHelper::merge(parent::rules(),
            [
                [['banner_img','banner_heading', 'banner_description', 'banner_page_link', 'content_text'], 'safe'],
            ]);
    }

    public function attributeLabels()
    {
        return [
            'banner_img' => Yii::t('yee/settings', 'Banner'),
            'banner_heading' => Yii::t('yee/settings', 'Banner Heading'),
            'banner_description' => Yii::t('yee/settings', 'Banner Description'),
            'banner_page_link' => Yii::t('yee/settings', 'Banner Page Link'),
            'content_text' => Yii::t('yee/settings', 'Content'),
            
        ];
    }

}