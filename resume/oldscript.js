let showWelcome = function(){
  $("#welcome").modal();
}

let pro_app = angular.module('professional',[]);
pro_app.controller('control',function($scope){
	'use strict';

  $scope.current_order = 'dept';

	$scope.courses = [
    {dept:'AST', number:1001, title:'Exploring the Universe'},
    {dept:'BIOL', number:1009, title:'General Biology'},
    {dept:'CSE', number:1001, title:'First Year Experience'},
    {dept:'CSCI', number:1113, title:'Intro to C/C++'},
    {dept:'CSCI', number:1913, title:'Intro to Algorithms and Program Development'},
    {dept:'CSCI', number:2011, title:'Discrete Structures'},
    {dept:'CSCI', number:2021, title:'Machine Architecture and Organization'},
    {dept:'CSCI', number:2041, title:'Advanced Programming Principles'},
    {dept:'CSCI', number:4011, title:'Formal Languages and Automata Theory'},
    {dept:'CSCI', number:4061, title:'Introduction to Operating Systems'},
    {dept:'CSCI', number:4511, title:'Introduction to Artificial Intelligence'},
    {dept:'CSCI', number:4611, title:'Programming Interactive Computer Graphics and Games'},
    {dept:'CSCI', number:5512, title:'Artificial Intelligence II'},
    {dept:'CSCI', number:5523, title:'Introduction to Data Mining'},
    {dept:'CSCI', number:5607, title:'Computer Graphics I'},
    {dept:'GCD', number:3022, title:'Genetics'},
    {dept:'JOUR', number:1501, title:'Digital Games, Sims and Apps'},
    {dept:'PE', number:1014, title:'Conditioning'},
    {dept:'PE', number:1035, title:'Karate'},
    {dept:'PE', number:1074, title:'Beginning Volleyball'},
    {dept:'PHYS', number:1301, title:'Physics for Scientist and Engineers I'},
    {dept:'PSTL', number:1368, title:'Stories of Social Change'},
    {dept:'STAT', number:3021, title:'Introduction to Probability and Statistics'},
    {dept:'WRIT', number:1301, title:'University Writing'}
  ];

  $scope.changeOrder = function(category){
    $scope.current_order = category;
  };

});
