<?php
/**
 * ownCloud - rootviewer
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Hugo Gonzalez Labrador (CERN) <hugo.gonzalez.labrador@cern.ch>
 * @copyright Hugo Gonzalez Labrador (CERN) 2017
 */

namespace OCA\RootViewer\AppInfo;

use OCP\AppFramework\App;

require_once __DIR__ . '/autoload.php';

$app = new App('rootviewer');
$container = $app->getContainer();

\OCP\Util::addScript('rootviewer', 'script');
\OCP\Util::addStyle('rootviewer', 'style');


\OCP\Util::addStyle('rootviewer', 'style');
\OCP\Util::addStyle('rootviewer', 'vendor/JSRootPainter.min');
\OCP\Util::addStyle('rootviewer', 'vendor/JSRootInterface.min');

\OCP\Util::addscript('rootviewer', 'editor');
\OCP\Util::addscript('rootviewer', 'scripts/JSRootCore.min');
\OCP\Util::addscript('rootviewer', 'scripts/d3.v3.min');
\OCP\Util::addscript('rootviewer', 'scripts/JSRootPainter.min');
\OCP\Util::addscript('rootviewer', 'scripts/JSRootInterface.min');
\OCP\Util::addscript('rootviewer', 'scripts/JSRootPainter.jquery.min');
/*
\OCP\Util::addscript('rootviewer', 'scripts/JSRootIOEvolution.min');
 */

$policy = new \OCP\AppFramework\Http\EmptyContentSecurityPolicy();
$policy->allowInlineScript(true);
\OC::$server->getContentSecurityPolicyManager()->addDefaultPolicy($policy);
