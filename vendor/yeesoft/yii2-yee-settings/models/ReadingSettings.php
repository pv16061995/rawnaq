<?php

namespace yeesoft\settings\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * @author Taras Makitra <makitrataras@gmail.com>
 */
class ReadingSettings extends BaseSettingsModel
{
    const GROUP = 'reading';

    public $page_size;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return ArrayHelper::merge(parent::rules(),
            [
                [['page_size'], 'required'],
                [['page_size'], 'integer'],
                ['page_size', 'default', 'value' => 10],
            ]);
    }

    public function attributeLabels()
    {
        return [
            'page_size' => Yii::t('yee/settings', 'Page Size'),
        ];
    }

}