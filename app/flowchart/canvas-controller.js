(function() {

  'use strict';

  function canvasController($scope, Mouseoverfactory, Nodedraggingfactory, Modelfactory, Edgedraggingfactory, Edgedrawingservice) {

    $scope.userCallbacks = $scope.userCallbacks || {};
    angular.forEach($scope.userCallbacks, function(callback) {
      if (!angular.isFunction(callback)) {
        throw new Error('All callbacks should be functions.');
      }
    });

    $scope.modelservice = Modelfactory($scope.model, $scope.selectedObjects);

    $scope.nodeDragging = {};
    var nodedraggingservice = Nodedraggingfactory($scope.modelservice, $scope.nodeDragging, $scope.$apply.bind($scope));

    $scope.edgeDragging = {};
    var edgedraggingservice = Edgedraggingfactory($scope.modelservice, $scope.model, $scope.edgeDragging, $scope.userCallbacks.isValidEdge || null, $scope.$apply.bind($scope));

    $scope.mouseOver = {};
    var mouseoverservice = Mouseoverfactory($scope.mouseOver, $scope.$apply.bind($scope));

    $scope.edgeMouseEnter = mouseoverservice.edgeMouseEnter;
    $scope.edgeMouseLeave = mouseoverservice.edgeMouseLeave;

    $scope.canvasClick = $scope.modelservice.deselectAll;

    $scope.drop = nodedraggingservice.drop;
    $scope.dragover = function(event) {
      nodedraggingservice.dragover(event);
      edgedraggingservice.dragover(event);
    };

    $scope.edgeClick = function(event, edge) {
      $scope.modelservice.edges.handleEdgeMouseClick(edge, event.ctrlKey);
      // Don't let the chart handle the mouse down.
      event.stopPropagation();
      event.preventDefault();
    };

    $scope.edgeDoubleClick = $scope.userCallbacks.edgeDoubleClick || angular.noop;
    $scope.edgeMouseOver = $scope.userCallbacks.edgeMouseOver || angular.noop;

    $scope.callbacks = {
      nodeDragstart: nodedraggingservice.dragstart,
      nodeDragend: nodedraggingservice.dragend,
      edgeDragstart: edgedraggingservice.dragstart,
      edgeDragend: edgedraggingservice.dragend,
      edgeDrop: edgedraggingservice.drop,
      edgeDragoverConnector: edgedraggingservice.dragoverConnector,
      edgeDragoverMagnet: edgedraggingservice.dragoverMagnet,
      nodeMouseEnter: mouseoverservice.nodeMouseEnter,
      nodeMouseLeave: mouseoverservice.nodeMouseLeave,
      connectorMouseEnter: mouseoverservice.connectorMouseEnter,
      connectorMouseLeave: mouseoverservice.connectorMouseLeave,
      nodeClicked: function(node) {
        return function(event) {
          $scope.modelservice.nodes.handleClicked(node, event.ctrlKey);
          $scope.$apply();

          // Don't let the chart handle the mouse down.
          event.stopPropagation();
          event.preventDefault();
        }
      }
    };

    $scope.getEdgeDAttribute = Edgedrawingservice.getEdgeDAttribute;
  }

  angular
    .module('flowchart')
    .controller('canvasController', canvasController);

}());

