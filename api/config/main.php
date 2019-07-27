<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'), 
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);

return [
    'id' => 'api',
    'homeUrl' => '/api',
    'basePath' => dirname(__DIR__),
    'controllerNamespace' => 'api\controllers',
    'modules' => [
        'v1' => [
            'class' => 'app\modules\v1\Module',
        ]
    ],
    'bootstrap' => [
        'log',
        [
            'class' => \yii\filters\ContentNegotiator::className(),
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
                'application/xml' => \yii\web\Response::FORMAT_XML,
            ],
        ],
    ],
    'components' => [
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'urlManager' => [
            'class' => 'yeesoft\web\MultilingualUrlManager',
            'showScriptName' => false,
            'enablePrettyUrl' => true,
            'multilingualRules' => false,
            'rules' => array(
                '<module:\w+>/' => '<module>/default/index',
                '<module:\w+>/<action:\w+>/<id:\d+>' => '<module>/default/<action>',
                '<module:\w+>/<action:(create)>' => '<module>/default/<action>',
                '<module:\w+>/<controller:\w+>' => '<module>/<controller>/index',
                '<module:\w+>/<controller:\w+>/<action:\w+>/<id:\d+>' => '<module>/<controller>/<action>',
                '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
            )
        ],
        'request' => [
            'baseUrl' => '/api',
            'cookieValidationKey' => 'ZpAilljzpLNo53cJbXBg684nWRrv5ZKd',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'response' => [
            'class' => \yii\web\Response::className(),
            'on beforeSend' => function ($event) {
                $response = $event->sender;
                if ($response->data !== null && ($exception = Yii::$app->getErrorHandler()->exception) !== null) {
                    $response->data = [
                        'error' => $response->data,
                    ];
                }
            },
        ],
    ],
    'params' => $params,
];

