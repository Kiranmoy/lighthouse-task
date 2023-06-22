node {

    stage('CLONE'){
        bat "if exist lighthouse-task rmdir /s /q lighthouse-task"
        bat "git clone https://github.com/Kiranmoy/lighthouse-task.git"
    } 

    stage("CONFIGURE") {
        bat "mkdir $BUILD_NUMBER"
    } 

    stage('RUN'){
        dir("lighthouse-task"){
            bat "node index.js"
            bat "move lighthouse-audit-report.html $WORKSPACE\\$BUILD_NUMBER\\"
        }
        
    } 

    stage('PUBLISH RESULT'){        
        archiveArtifacts artifacts: "$BUILD_NUMBER\\lighthouse-audit-report.html"
        publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: "$BUILD_NUMBER", reportFiles: "lighthouse-audit-report.html", reportName: 'Lighthouse Performance Audit Report', reportTitles: "", useWrapperFileDirectly: true])
    } 

}
