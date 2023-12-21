import { Injectable, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token, } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { OrderNotificationComponent } from 'src/app/pages/order/order-notification/order-notification.component';
import { ToastController } from '@ionic/angular';
import { Howl } from 'howler';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  fcmToken: string;
  sound;

  constructor(private modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router,
    private zone: NgZone) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private async registerPush() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });
    if (Capacitor.getPlatform() !== 'web') {
      // Creating a new notification channel for new orders
      PushNotifications.createChannel({
        id: "New_Orders",
        name: "New Orders",
        description: "New order notifications",
        importance: 4,
        sound: "neworder.mp3",
        vibration: true,
        visibility: 1,
        lights: true,
        lightColor: '#FF0000',
      });
    }

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
      this.fcmToken = token.value;
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      //alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push Notification Received', notification);
      // alert('Push received: ' + JSON.stringify(notification));
      if (notification?.data?.order) {
        this.showToastWithCloseButton(notification); // Notification flickering turned off as order id was not coming in notification
      } else {
        console.log('Basic notification received')
      }
    },
    );

    PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      //alert('Push action performed: ' + JSON.stringify(notification));
      if (notification?.notification?.data?.order) {
        let order = JSON.parse(notification?.notification?.data?.order)
        const { orderID, status } = order;
        this.zone.run(() => this.router.navigate(['/order-details', orderID, status]));
      } else {
        console.log('Normal Notification Received')
      }
    },
    );
  }

  async openFullScreenPopUp(notification) {
    const model = await this.modalCtrl.create({
      component: OrderNotificationComponent,
      swipeToClose: true,
      mode: 'ios',
      backdropDismiss: true,
      breakpoints: [0, 1],
      initialBreakpoint: 0.6,
      componentProps: {
        order: notification?.data?.order
      },
    });
    this.modalCtrl.dismiss();
    await model.present();
    const { data } = await model.onWillDismiss();
  }

  async showToastWithCloseButton(notification) {
    if (this.sound) {
      this.sound?.pause()
    }
    this.sound = new Howl({
      src: ['assets/sound/ordernotification.wav'],
      loop: true
    });
    this.sound.play();
    const toast = await this.toastController.create({
      message: notification?.data?.message ? notification?.data?.message : 'New notification received.',
      position: 'top',
      mode: 'ios',
      icon: 'happy-outline',
      color: 'primary',
      buttons: [
        {
          side: 'end',
          text: 'Details',
          handler: () => {
            this.openFullScreenPopUp(notification)
            this.sound.pause();
          }
        }, {
          side: 'end',
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.sound.pause();
          }
        }
      ]
    });
    toast.present();
  }
}
