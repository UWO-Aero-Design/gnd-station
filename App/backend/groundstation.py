#Main application module

from app import create_app,socketio,dbase,serialWriteEvent,serialDataOut

app = create_app(debug=True)    
app.app_context().push()

if __name__ == '__main__':
    socketio.run(app,host='0.0.0.0',port=5000)