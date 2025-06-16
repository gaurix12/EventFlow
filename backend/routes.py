from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models import db, User, Event, Registration
from datetime import datetime

rte_bp = Blueprint('route', __name__)


# admin creates event
@rte_bp.route('/admin/create-event', methods=["POST"])
@login_required
def create_event():
    if current_user.role != "admin":
        return jsonify({"message": "Access denied. Admins only."}), 403

    data = request.json
    try:
        datetime.strptime(data['date'], '%Y-%m-%d')
    except ValueError:
        return jsonify({'message': 'Date must be in YYYY-MM-DD format.'}), 400

    new_event = Event(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        location=data['location'],
        capacity=data['capacity']
    )

    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Event created successfully", "event_id": new_event.id})


# user registers for event
@rte_bp.route('/event/<int:event_id>/register-user', methods=["POST"])
@login_required
def register_user_for_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    if len(event.registrations) >= event.capacity:
        return jsonify({"message": "Event is already full"}), 400

    exists = Registration.query.filter_by(event_id=event_id, user_id=current_user.id).first()
    if exists:
        return jsonify({"message": "User already registered"}), 400

    data = request.json
    try:
        new_registration = Registration(
            event_id=event_id,
            user_id=current_user.id,
            username=data['username'],
            email=data['email'],
            phone=data['phone']
        )
    except KeyError as e:
        return jsonify({"message": f"Missing field: {e.args[0]}"}), 400

    db.session.add(new_registration)
    db.session.commit()
    return jsonify({"message": "User registered successfully"})


# fetch event details
@rte_bp.route('/event/<int:event_id>', methods=["GET"])
def get_event_details(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "location": event.location,
        "capacity": event.capacity,
        "registrations": len(event.registrations)
    })


# all events
@rte_bp.route('/events', methods=["GET"])
def events_page():
    events = Event.query.all()
    result = [
        {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "capacity": event.capacity,
            "registrations": len(event.registrations)
        } for event in events
    ]
    return jsonify(result)


# user cancels registration
@rte_bp.route('/event/<int:event_id>/cancel', methods=["POST"])
@login_required
def cancel_registration(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    registration = Registration.query.filter_by(event_id=event_id, user_id=current_user.id).first()
    if not registration:
        return jsonify({"message": "You are not registered for this event"}), 404

    db.session.delete(registration)
    db.session.commit()
    return jsonify({"message": "Registration cancelled successfully"})


# admin edits event
@rte_bp.route('/event/<int:event_id>/edit', methods=["PUT"])
@login_required
def edit_event(event_id):
    if current_user.role != 'admin':
        return jsonify({"message": "Access denied. Admins only."}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    data = request.json
    event.title = data.get('title', event.title)
    event.description = data.get('description', event.description)
    event.date = data.get('date', event.date)
    event.location = data.get('location', event.location)
    event.capacity = data.get('capacity', event.capacity)

    db.session.commit()
    return jsonify({"message": "Event updated successfully"})


# admin views registrations for an event
@rte_bp.route('/admin/event/<int:event_id>/registrations', methods=['GET'])
@login_required
def view_event_registrations(event_id):
    if current_user.role != 'admin':
        return jsonify({"message": "Access denied. Admins only."}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    registrations = Registration.query.filter_by(event_id=event_id).all()
    result = {
        "event_title": event.title,
        "registrations": [
            {
                "name": reg.user.username,
                "email": reg.user.email,
                "phone": reg.phone
            } for reg in registrations
        ]
    }
    return jsonify(result)


# user dashboard
@rte_bp.route('/dashboard', methods=["GET"])
@login_required
def user_dashboard():
    user_regs = Registration.query.filter_by(user_id=current_user.id).all()
    data = [
        {
            "title": reg.event.title,
            "date": reg.event.date,
            "location": reg.event.location
        }
        for reg in user_regs
    ]
    return jsonify(data)


# check role
@rte_bp.route('/check-role')
def check_role():
    if current_user.is_authenticated:
        return jsonify({"role": current_user.role})
    return jsonify({"role": "guest"})


# check if user is registered for event
@rte_bp.route('/event/<int:event_id>/is-registered', methods=['GET'])
@login_required
def is_user_registered(event_id):
    registered = Registration.query.filter_by(user_id=current_user.id, event_id=event_id).first() is not None
    return jsonify({"registered": registered})


# admin deletes event
@rte_bp.route('/event/<int:event_id>/delete', methods=["DELETE"])
@login_required
def delete_event(event_id):
    if current_user.role != 'admin':
        return jsonify({"message": "Access denied. Admins only."}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"message": "Event not found"}), 404

    Registration.query.filter_by(event_id=event_id).delete()
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted successfully"})
