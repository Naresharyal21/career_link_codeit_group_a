from .models import Notification


def notify_user(user, message, type=Notification.NotificationType.SYSTEM, link=""):
    return Notification.objects.create(user=user, message=message, type=type, link=link)