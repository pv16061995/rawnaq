<?php

namespace common\modules\hotel\controllers;

use Yii;
use yii\base\Model;
use yii\widgets\ActiveForm;
use yii\helpers\ArrayHelper;
use yeesoft\controllers\admin\BaseController;
use common\modules\hotel\models\Destination;
use common\modules\hotel\models\DestinationGalleries;

/**
 * DestinationController implements the CRUD actions for hotel\models\Destination model.
 */
class DestinationController extends BaseController
{

    public $disabledActions = ['view', 'bulk-activate', 'bulk-deactivate'];

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
        $this->modelClass = $this->module->destinationModelClass;
        $this->modelSearchClass = $this->module->destinationModelSearchClass;

        $this->indexView = $this->module->destinationIndexView;
        $this->viewView = $this->module->destinationViewView;
        $this->createView = $this->module->destinationCreateView;
        $this->updateView = $this->module->destinationUpdateView;

        parent::init();
    }

    protected function getRedirectPage($action, $model = null)
    {
        switch ($action) {
            case 'update':
                return ['update', 'id' => $model->id];
                break;
            case 'create':
                return ['update', 'id' => $model->id];
                break;
            default:
                return parent::getRedirectPage($action, $model);
        }
    }

    public function actionCreate()
    {
        $model = new Destination;
        $modelsGalleries = [new DestinationGalleries];
        if ($model->load(Yii::$app->request->post())) {
            $modelsGalleries = DestinationGalleries::createMultiple(DestinationGalleries::classname());
            Model::loadMultiple($modelsGalleries, Yii::$app->request->post());
            
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validateMultiple($modelsGalleries),
                    ActiveForm::validate($model)
                );
            }
            foreach ($modelsGalleries as $modelIndex=>$modelsGallery) {
                $modelsGalleries[$modelIndex]->hotel_destination_id = 1;
            }
            
            // validate all models
            $valid = $model->validate();
            $valid = $valid && Model::validateMultiple($modelsGalleries);
            
            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $model->save(false)) {
                        foreach ($modelsGalleries as $modelsGallery) {
                            $modelsGallery->hotel_destination_id = $model->id;

                            if (($flag = $modelsGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been created.'));
                        return $this->redirect($this->getRedirectPage('create', $model));
                    }
                }catch (Exception $e){
                    $transaction->rollBack();
                }
            }
        }
        
        return $this->render('create', [
            'model' => $model,
            'modelsGalleries' => (empty($modelsGalleries)) ? [new DestinationGalleries] : $modelsGalleries,
        ]);
    }
    
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);
        $modelsGalleries = $model->destinationGalleries;
        if ($model->load(Yii::$app->request->post())) {
            $oldIDs = ArrayHelper::map($modelsGalleries, 'id', 'id');
            $modelsGalleries = DestinationGalleries::createMultiple(DestinationGalleries::classname(), $modelsGalleries);
            Model::loadMultiple($modelsGalleries, Yii::$app->request->post());
            foreach ($modelsGalleries as $modelIndex=>$modelService) {
                $modelsGalleries[$modelIndex]->hotel_destination_id = $id;
            }
            $deletedIDGalls = array_diff($oldIDs, array_filter(ArrayHelper::map($modelsGalleries, 'id', 'id')));
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validate($model),
                    ActiveForm::validateMultiple($modelsGalleries)
                );
            }
            
            // validate all models
            $valid = $model->validate();
            $valid = Model::validateMultiple($modelsGalleries) && $valid;
            
            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $model->save(false)) {
                        
                        if (! empty($deletedIDGalls)) {
                            DestinationGalleries::deleteAll(['id' => $deletedIDGalls]);
                        }
                        foreach ($modelsGalleries as $modelsGallery) {
                            $modelsGallery->hotel_destination_id = $model->id;

                            if (($flag = $modelsGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been updated.'));
                        return $this->redirect($this->getRedirectPage('update', $model));
                    }
                } catch (Exception $e) {
                    $transaction->rollBack();
                }
            }
        }
        
        return $this->render('update', [
            'model' => $model,
            'modelsGalleries' => (empty($modelsGalleries)) ? [new DestinationGalleries] : $modelsGalleries,
        ]);
    }
}
