<?php

namespace common\modules\hotel\controllers;

use Yii;
use yii\filters\VerbFilter;
use yii\helpers\ArrayHelper;
use yii\web\NotFoundHttpException;
use yii\web\Response;
use yii\widgets\ActiveForm;
use yii\base\Model;
use yeesoft\controllers\admin\BaseController;
use common\modules\hotel\models\Room;
use common\modules\hotel\models\Hotel;
use common\modules\hotel\models\search\HotelSearch as HotelSearch;
use \common\modules\hotel\models\HotelRooms;
use common\modules\hotel\models\HotelRoomServices;
use common\modules\hotel\models\HotelRoomGalleries;
use common\modules\hotel\models\HotelRoomGalleryImage;
use yeesoft\helpers\YeeHelper;
use yeesoft\models\OwnerAccess;
use yeesoft\models\User;
use yii\helpers\StringHelper;

/**
 * RoomController implements the CRUD actions for hotel\models\Destination model.
 */
class RoomController extends BaseController
{

    public $disabledActions = ['view', 'bulk-activate', 'bulk-deactivate'];

    public function init()
    {
        $this->layout = '@app/views/layouts/admin/main.php';
        $this->modelClass = $this->module->roomModelClass;
        $this->modelSearchClass = $this->module->roomModelSearchClass;

        $this->indexView = $this->module->roomIndexView;
        $this->viewView = $this->module->roomViewView;
        $this->createView = $this->module->roomCreateView;
        $this->updateView = $this->module->roomUpdateView;

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

    public function actionCreate($hotel_id=null)
    {
        if(!$hotel_id){
            $this->redirect($this->getRedirectPage('index'));
        }
        
        $modelRoom = new Room;
        $modelsRoomGalleries = [new HotelRoomGalleries];
        $modelsServices = [new HotelRoomServices()];
        if ($modelRoom->load(Yii::$app->request->post())) {
            
            $modelsServices = HotelRoomServices::createMultiple(HotelRoomServices::classname());
            Model::loadMultiple($modelsServices, Yii::$app->request->post());
            
            $modelsRoomGalleries = HotelRoomGalleries::createMultiple(HotelRoomGalleries::classname());
            Model::loadMultiple($modelsRoomGalleries, Yii::$app->request->post());
            
            $modelsRoomHotel = new HotelRooms;
            $modelsRoomHotel->hotel_id = $hotel_id;
            $modelsRoomHotel->room_id = 1;
            
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validateMultiple($modelsRoomGalleries),
                    ActiveForm::validate($modelRoom),
                    ActiveForm::validate($modelsServices)
                );
            }

            foreach ($modelsServices as $modelIndex=>$modelService) {
                $modelsServices[$modelIndex]->room_id = 1;
            }
            
            foreach ($modelsRoomGalleries as $modelIndex=>$modelsRoomGallery) {
                $modelsRoomGalleries[$modelIndex]->hotel_room_id = 1;
            }
            
            // validate all models
            $valid = $modelRoom->validate();
            $valid = Model::validateMultiple($modelsRoomGalleries) && Model::validateMultiple($modelsServices) && $modelsRoomHotel->validate() && $valid;
            
            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $modelRoom->save(false)) {
                        $modelsRoomHotel->room_id = $modelRoom->id;
                        if (!($flag = $modelsRoomHotel->save(false))) {
                            $transaction->rollBack();
                        }
                        
                        foreach ($modelsRoomGalleries as $modelsRoomGallery) {
                            $modelsRoomGallery->hotel_room_id = $modelRoom->id;

                            if (($flag = $modelsRoomGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                        foreach ($modelsServices as $modelService) {
                            $modelService->room_id = $modelRoom->id;
                            if (! ($flag = $modelService->save(false))) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                    }
                    if ($flag) {
                        $transaction->commit();
                        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been created.'));
                        return $this->redirect($this->getRedirectPage('create', $modelRoom));
                    }
                } catch (Exception $e) {
                    $transaction->rollBack();
                }
            }

        }

        return $this->render('create', [
            'model' => $modelRoom,
            'modelsRoomGalleries' => (empty($modelsRoomGalleries)) ? [new HotelRoomGalleries] : $modelsRoomGalleries,
            'modelsServices' => (empty($modelsServices)) ? [new HotelRoomServices] : $modelsServices
        ]);
        //return parent::actionCreate(); // TODO: Change the autogenerated stub
    }
    
    public function actionIndex($hotel_id = null)
    {
        $modelClass = "common\modules\hotel\models\Hotel";
        $searchModel = new HotelSearch;
        
        if($hotel_id){
            $modelClass = $this->modelClass;
            $searchModel = $this->modelSearchClass ? new $this->modelSearchClass : null;
        }
        $restrictAccess = (YeeHelper::isImplemented($modelClass, OwnerAccess::CLASSNAME)
            && !User::hasPermission($modelClass::getFullAccessPermission()));

        if ($searchModel) {
            $searchName = StringHelper::basename($searchModel::className());
            $params = Yii::$app->request->getQueryParams();

            if ($restrictAccess) {
                $params[$searchName][$modelClass::getOwnerField()] = Yii::$app->user->identity->id;
            }

            $dataProvider = $searchModel->search($params);
        } else {
            $restrictParams = ($restrictAccess) ? [$modelClass::getOwnerField() => Yii::$app->user->identity->id] : [];
            $dataProvider = new ActiveDataProvider(['query' => $modelClass::find()->where($restrictParams)]);
        }

        return $this->renderIsAjax($this->indexView, compact('dataProvider', 'searchModel', 'hotel_id'));
    }
    
    public function actionUpdate($id)
    {
        $model = $this->findModel($id);
        $modelsServices = $model->hotelRoomService;
        $modelsRoomGalleries = $model->hotelRoomGalleries;
        //echo "<pre>"; print_r($modelsRoomGalleries);exit;
        if ($model->load(Yii::$app->request->post())) {
            $oldIDs = ArrayHelper::map($modelsServices, 'id', 'id');
            $modelsServices = HotelRoomServices::createMultiple(HotelRoomServices::classname(), $modelsServices);
            Model::loadMultiple($modelsServices, Yii::$app->request->post());
            foreach ($modelsServices as $modelIndex=>$modelService) {
                $modelsServices[$modelIndex]->room_id = $id;
            }
            $deletedIDs = array_diff($oldIDs, array_filter(ArrayHelper::map($modelsServices, 'id', 'id')));

            $modelsRoomGalleries = HotelRoomGalleries::createMultiple(HotelRoomGalleries::classname(), $modelsRoomGalleries);
            Model::loadMultiple($modelsRoomGalleries, Yii::$app->request->post());
            foreach ($modelsRoomGalleries as $modelIndex=>$modelService) {
                $modelsRoomGalleries[$modelIndex]->hotel_room_id = $id;
            }
            $deletedIDGalls = array_diff($oldIDs, array_filter(ArrayHelper::map($modelsRoomGalleries, 'id', 'id')));
            
            // ajax validation
            if (Yii::$app->request->isAjax) {
                Yii::$app->response->format = Response::FORMAT_JSON;
                return ArrayHelper::merge(
                    ActiveForm::validateMultiple($modelsServices),
                    ActiveForm::validate($model),
                    ActiveForm::validateMultiple($modelsRoomGalleries)
                );
            }

            // validate all models
            $valid = $model->validate();
            $valid = Model::validateMultiple($modelsRoomGalleries) && Model::validateMultiple($modelsServices) && $valid;
            

            if ($valid) {
                $transaction = \Yii::$app->db->beginTransaction();
                try {
                    if ($flag = $model->save(false)) {
                        //echo "<pre>"; print_r($modelsServices);exit;
                        if (! empty($deletedIDs)) {
                            HotelRoomServices::deleteAll(['id' => $deletedIDs]);
                        }
                        if (! empty($deletedIDGalls)) {
                            HotelRoomGalleries::deleteAll(['id' => $deletedIDGalls]);
                        }
                        foreach ($modelsRoomGalleries as $modelsRoomGallery) {
                            $modelsRoomGallery->hotel_room_id = $model->id;

                            if (($flag = $modelsRoomGallery->save(false)) === false) {
                                $transaction->rollBack();
                                break;
                            }
                        }
                        foreach ($modelsServices as $modelService) {
                            $modelService->room_id = $model->id;
                            if (! ($flag = $modelService->save(false))) {
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
            'modelsRoomGalleries' => (empty($modelsRoomGalleries)) ? [new HotelRoomGalleries] : $modelsRoomGalleries,
            'modelsServices' => (empty($modelsServices)) ? [new HotelRoomServices] : $modelsServices
        ]);
       //return parent::actionUpdate($id); // TODO: Change the autogenerated stub
    }
    
    public function actionDelete($id)
    {
        /* @var $model \yeesoft\db\ActiveRecord */
        $model = $this->findModel($id);
        //echo "<pre>"; print_r($model->hotelRooms[0]->hotelRoomGalleries);exit;
        if($model){
            // delete lang
            foreach($model->translations as $translation){
                $translation->delete();
            }
            //delete service
            HotelRoomServices::deleteAll(['room_id' => $id]);
            
            $hotelRoom = \common\modules\hotel\models\HotelRooms::findOne(['room_id' => $id]);
            $hotelRoom->delete();
            //delete room
            foreach($model->hotelRoomGalleries as $gallery){
                $gallery->delete();
            }
        }
        $model->delete();

        Yii::$app->session->setFlash('crudMessage', Yii::t('yee', 'Your item has been deleted.'));
        return $this->redirect($this->getRedirectPage('delete', $model));
    }
}
