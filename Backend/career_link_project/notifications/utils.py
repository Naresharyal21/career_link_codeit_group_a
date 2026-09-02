from .models import Notification


def notify_user(user, message, type=Notification.NotificationType.SYSTEM):
    return Notification.objects.create(user=user, message=message, type=type)