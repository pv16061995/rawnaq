<?php

namespace yeesoft\settings\controllers;

use yeesoft\controllers\admin\BaseController;
use yeesoft\helpers\YeeHelper;
use Yii;

/**
 * CacheController implements Flush Cache page.
 *
 * @author Taras Makitra <makitrataras@gmail.com>
 */
class CacheController extends BaseController
{
    /**
     * @inheritdoc
     */
    public $enableOnlyActions = ['flush'];

    public function actionFlush()
    {
        $frontendAssetPath = Yii::getAlias('@frontend') . '/web/assets/';
        $backendAssetPath = Yii::getAlias('@backend') . '/web/assets/';

        YeeHelper::recursiveDelete($frontendAssetPath);
        YeeHelper::recursiveDelete($backendAssetPath);
        
        if (!is_dir($frontendAssetPath)) {
            @mkdir($frontendAssetPath);
        }
        
        if (!is_dir($backendAssetPath)) {
            @mkdir($backendAssetPath);
        }

        if (Yii::$app->cache->flush()) {
            Yii::$app->session->setFlash('crudMessage', 'Cache has been flushed.');
        } else {
            Yii::$app->session->setFlash('crudMessage', 'Failed to flush cache.');
        }

        return Yii::$app->getResponse()->redirect(Yii::$app->getRequest()->referrer);
    }
}